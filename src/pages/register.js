import React, { useState } from "react";
import HeadMeta from "@/components/HeadMeta";
import Link from "next/link";
import bcrypt from "bcryptjs";
import { Form, Input, Button, Checkbox, DatePicker, notification } from "antd";
import { useRouter } from "next/router";

function Register() {
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    const dataToInsert = {
      firstName: values?.firstName,
      email: values?.email,
      password: bcrypt.hashSync(values?.password),
      profilePhoto: "", 
      lastName: "", 
      phoneNumber: "",  
      newsletterSubscribed: true, 
      suburb: "", 
      postcode: 0, 
      country: "", 
      isVerified: false, 
      isPhoneVerified: false, 
      isEmailPendingVerification: true, 
      profileCompletion: 25 
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registerUser`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToInsert),
      }
    );

    if (res.ok && res.status === 200) {
      api.success({
        message: "Success",
        description: "Successfully created",
      });

      setTimeout(() => {
        router?.replace(`/authv/check-email?email=${encodeURIComponent(values?.email)}`);
      }, 1500)

    } else if (res.status === 400) {
      api.warning({
        message: "Bad request",
        description: "Email is already used",
      });
    } else {
      api.error({
        message: "Error",
        description: "Failed to register",
      });
    }

    setLoading(false);
  };

  return (
    <div>
      {contextHolder}

      <HeadMeta page="register" />
      <div className="custom-container">
        <h1>Join The Injexi Club</h1>
        <Form
          className="custom-form"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            className="form-item-white"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>
                First name:
              </span>
            }
            name="firstName"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            className="form-item-white"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>Email:</span>
            }
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "This field is required",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            className="form-item"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>
                Create Password:
              </span>
            }
            name="password"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            className="form-item"
            label={
              <span style={{ color: "#ffff", fontSize: "18px" }}>
                Confirm Password:
              </span>
            }
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "This field is required",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The password that you entered do not match!")
                  );
                },
              }),
            ]}
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
              Create Account
            </Button>
          </Form.Item>
          <p>
            Have an Account? <Link href="/login">Sign In</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Register;
