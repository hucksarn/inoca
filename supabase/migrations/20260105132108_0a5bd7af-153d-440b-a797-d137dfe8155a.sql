-- Drop the problematic restrictive admin INSERT policy
DROP POLICY IF EXISTS "Admins can create requests" ON public.material_requests;

-- The "Users can create their own requests" policy is also RESTRICTIVE, need to recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can create their own requests" ON public.material_requests;

-- Recreate the user INSERT policy as PERMISSIVE (default)
CREATE POLICY "Users can create their own requests" 
ON public.material_requests 
FOR INSERT 
TO authenticated
WITH CHECK (requester_id = auth.uid());

-- Create a separate PERMISSIVE policy for admins to create on behalf of others
CREATE POLICY "Admins can create any request" 
ON public.material_requests 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));