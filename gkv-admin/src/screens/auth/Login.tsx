import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { addAuth } from "../../redux/reducers/authReducer";
import { localDataNames } from "../../constants/appInfos";

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log(values);
    setIsLoading(true);
    try {
      const res: any = await handleAPI("/auth/login", "post", values);
      console.log(res);
      message.success(res.message || "Login successful!");

      if (res.data) {
        dispatch(addAuth(res.data));

        // Always save to localStorage to persist auth state on reload
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));

        // Redirect to main page
        navigate("/");
      }
    } catch (error: any) {
      message.error(error.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        style={{
          width: "50%",
          maxWidth: 480,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          borderRadius: 16,
        }}
      >
        <div className="text-center">
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🔥
          </div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Welcome Back
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 16 }}>
            Sign in to GasKhanhVan Admin Panel
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!!!",
              },
            ]}
          >
            <Input allowClear maxLength={100} type="email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!!!",
              },
            ]}
          >
            <Input.Password maxLength={100} type="email" />
          </Form.Item>
        </Form>

        <div className="row">
          <div className="col">
            <Checkbox
              checked={isRemember}
              onChange={(val) => setIsRemember(val.target.checked)}
            >
              Remember for 30 days
            </Checkbox>
          </div>
          <div className="col text-right">
            <Link to={"/"}>Forgot password?</Link>
          </div>
        </div>

        <div className="mt-4 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{
              width: "100%",
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
            }}
          >
            Sign In
          </Button>
        </div>
        <SocialLogin isRemember={isRemember} />
        <div className="mt-3 text-center">
          <Space>
            <Text>Don't have an acount? </Text>
            <Link to={"/sign-up"}>Sign up</Link>
          </Space>
        </div>
      </Card>
    </>
  );
};

export default Login;
