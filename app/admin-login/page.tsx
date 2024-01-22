import { AdminLoginForm } from "@/components/forms/admin-login-form";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLoginPage = () => {
  return (
    <div className='h-screen bg-primary flex justify-center items-center'>
      <Card className='sm:w-[500px] w-2/3'>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your email and password here.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm auth={"login"} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
