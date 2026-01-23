import { Button, message } from "antd";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import handleAPI from "../../../apis/handleAPI";
import { auth, googleProvider } from "../../../firebase/firebaseConfig";
import { addAuth } from "../../../redux/reducers/authReducer";
import { localDataNames } from "../../../constants/appInfos";

interface Props {
  isRemember?: boolean;
}

const SocialLogin = (_props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result) {
        const user = result.user;
        if (user) {
          // Get Firebase ID token
          const token = await user.getIdToken();

          const data = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            uid: user.uid,
          };

          const api = `/auth/google-login`;
          try {
            const res: any = await handleAPI(api, "post", data);
            message.success(res.message || "Login successful!");

            const authData = {
              token,
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
            };

            // Save auth data to Redux
            dispatch(addAuth(authData));

            // Always save to localStorage to persist auth state on reload
            localStorage.setItem(
              localDataNames.authData,
              JSON.stringify(authData),
            );
          } catch (error: any) {
            console.log(error);
            message.error(error.message || "Login failed!");
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        console.log("Can not login with google");
        message.error("Login failed!");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message || "Login failed!");
      setIsLoading(false);
    }
  };

  return (
    <Button
      loading={isLoading}
      onClick={handleLoginWithGoogle}
      style={{
        width: "100%",
      }}
      size="large"
      icon={
        <img
          width={24}
          height={24}
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
      }
    >
      Google
    </Button>
  );
};

export default SocialLogin;
