import React, { useState } from "react";
import HeadMeta from "@/components/HeadMeta";

import { Form, Input, Button, notification } from "antd";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

function Login() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const dataSession = useSession();
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/loginUser`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    if (res.ok && res.status === 200) {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false
      });

      api.success({
        message: "Success",
        description: "Successfully created",
      });

    } else if (res.status === 401) {
      api.warning({
        message: "Bad request",
        description: "Password is not correct",
      });
    } else if (res.status === 404) {
      api.warning({
        message: "Bad request",
        description: "User does not register to this platform",
      });
    }
     else {
      api.error({
        message: "Error",
        description: "Failed to login",
      });
    }

    const session = await getSession();
    
    setLoading(false);

    if (session) {
      setTimeout(() => {
        router?.replace('/user/dashboard');
      }, 1500)
    } else {
      api.warning({
        message: "Invalid",
        description: "Invalid email or password",
      });
    }

  };

  if (dataSession.status === "authenticated") {
    router?.replace('/user/dashboard');
  }

  return (
    <div>
      {contextHolder}

      <HeadMeta page="login" />
      <div className="custom-container">
        <h1>Login</h1>
        <Form
          className="custom-form"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            className="form-item-white"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>Email:</span>
            }
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'This field is required',
              },
            ]}
          >
            <Input
              size="large"
            />
          </Form.Item>

          <Form.Item
            className="form-item"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>
                Password:
              </span>
            }
            name="password"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input.Password size="large" />
          </Form.Item>


          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{ backgroundColor: "#F64CB7", borderColor: "#252525" }}
            >
              Log In
            </Button>
          </Form.Item>
          <p>
            
            <Link href="/authv/reset-password/">Forgot your password?</Link>
          </p>
          <p>
            Not a member? {" "}
            <Link href="/register">Join The Injexi Club - Free</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Login;
