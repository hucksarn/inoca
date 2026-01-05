-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create material_requests table
CREATE TABLE public.material_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT NOT NULL UNIQUE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('stock_request', 'purchase_request')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal')),
    required_date DATE,
    remarks TEXT,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pm_approved', 'pm_rejected', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on material_requests
ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;

-- Create material_request_items table
CREATE TABLE public.material_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.material_requests(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cement', 'steel', 'block', 'electrical', 'plumbing', 'finishing', 'other')),
    name TEXT NOT NULL,
    specification TEXT,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('nos', 'bags', 'kg', 'ton', 'm3')),
    preferred_brand TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on material_request_items
ALTER TABLE public.material_request_items ENABLE ROW LEVEL SECURITY;

-- Create approvals table
CREATE TABLE public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.material_requests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('approved', 'rejected')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on approvals
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "All authenticated users can view projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for material_requests
CREATE POLICY "Users can view their own requests"
ON public.material_requests FOR SELECT
TO authenticated
USING (requester_id = auth.uid());

CREATE POLICY "Admins can view all requests"
ON public.material_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own requests"
ON public.material_requests FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update their draft requests"
ON public.material_requests FOR UPDATE
TO authenticated
USING (requester_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can update all requests"
ON public.material_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for material_request_items
CREATE POLICY "Users can view items of their requests"
ON public.material_request_items FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.material_requests mr
    WHERE mr.id = request_id AND (mr.requester_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Users can insert items to their requests"
ON public.material_request_items FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.material_requests mr
    WHERE mr.id = request_id AND mr.requester_id = auth.uid() AND mr.status = 'draft'
));

CREATE POLICY "Users can update items of their draft requests"
ON public.material_request_items FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.material_requests mr
    WHERE mr.id = request_id AND mr.requester_id = auth.uid() AND mr.status = 'draft'
));

CREATE POLICY "Users can delete items from their draft requests"
ON public.material_request_items FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.material_requests mr
    WHERE mr.id = request_id AND mr.requester_id = auth.uid() AND mr.status = 'draft'
));

-- RLS Policies for approvals
CREATE POLICY "Users can view approvals of their requests"
ON public.approvals FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.material_requests mr
    WHERE mr.id = request_id AND (mr.requester_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Admins can create approvals"
ON public.approvals FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, designation)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
        COALESCE(NEW.raw_user_meta_data ->> 'designation', 'Site Supervisor')
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_material_requests_updated_at
    BEFORE UPDATE ON public.material_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate request number function
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_num
    FROM public.material_requests;
    
    NEW.request_number := 'REQ-' || LPAD(next_num::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_request_number
    BEFORE INSERT ON public.material_requests
    FOR EACH ROW EXECUTE FUNCTION public.generate_request_number();

-- Insert sample projects
INSERT INTO public.projects (name, location, status) VALUES
    ('Marina Bay Tower', 'Downtown District', 'active'),
    ('Sunset Heights Residences', 'West End', 'active'),
    ('Tech Park Complex', 'Innovation Hub', 'active');