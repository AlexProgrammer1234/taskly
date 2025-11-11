import {
  Button,
  Card,
  SegmentedControl,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import "./Login.css";
import { useState } from "react";
import { PersonIcon, InputIcon } from "@radix-ui/react-icons";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { AnimatePresence, motion } from "motion/react";
import BlurText from "../../components/blurText/BlurText";
import { auth } from "../../db/firebase.config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { toastStyle } from "../../constants/constants";

export default function Login({ loading }) {
  const [mode, setMode] = useState("login");
  const [showContinue, setShowContinue] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  async function signIn() {
    try {
      setLoginLoading(true);
      await signInWithEmailAndPassword(
        auth,
        signInData.email,
        signInData.password
      );
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Неправильний пароль чи пошта :(", {
          style: toastStyle,
        });
      } else {
        toast.error("Щось пішло не так під час входу :(", {
          style: toastStyle,
        });
      }
      setLoginLoading(false);
    }
  }

  async function signUp() {
    try {
      setSignupLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password
      ).then(() => {
        toast.success("Акаунт створено :3", {
          style: toastStyle,
        });
      });
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        toast.error("Неправильний формат пошти :(", {
          style: toastStyle,
        });
      } else if (error.code === "auth/weak-password") {
        toast.error("Пароль повинен містити принаймні 6 символів :(", {
          style: toastStyle,
        });
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Ця пошта вже використовується :(", {
          style: toastStyle,
        });
      } else {
        toast.error("Щось пішло не так під час реєстрації :(", {
          style: toastStyle,
        });
      }
      setSignupLoading(false);
    }
  }

  return (
    <div className="login">
      <AnimatePresence mode="wait">
        {!showContinue ? (
          <>
            {loading ? (
              <Card className="login__loading-card">
                <Spinner size="3" />
              </Card>
            ) : (
              <motion.div
                key="first"
                layoutId="login-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  layout: {
                    duration: 0.3,
                    type: "spring",
                    damping: 50,
                    mass: 1,
                    stiffness: 1000,
                  },
                }}
              >
                <Card className="login__card">
                  <BlurText
                    text="Taskly"
                    delay={300}
                    animateBy="letters"
                    stepDuration={0.3}
                    direction="bottom"
                    onAnimationComplete={() => setShowContinueButton(true)}
                    styles={{
                      fontSize: "50px",
                      marginBottom: "15px",
                      marginTop: "-5px",
                      fontWeight: "700",
                    }}
                  />
                  <Button
                    disabled={!showContinueButton}
                    className="login__continue-btn"
                    onClick={() => setShowContinue(true)}
                  >
                    Розпочати
                  </Button>
                </Card>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            key="second"
            layoutId="login-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              layout: {
                duration: 0.3,
                type: "spring",
                damping: 50,
                mass: 1,
                stiffness: 1200,
              },
            }}
          >
            <Card className="login__card">
              <SegmentedControl.Root
                defaultValue="login"
                value={mode}
                onValueChange={setMode}
                size="2"
                className="login__tabs"
              >
                <SegmentedControl.Item value="login">
                  Увійти
                </SegmentedControl.Item>
                <SegmentedControl.Item value="signup">
                  Зареєструватися
                </SegmentedControl.Item>
              </SegmentedControl.Root>

              {mode === "login" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="login__content"
                  >
                    <div className="login__avatar">
                      <AccountBoxRoundedIcon sx={{ fontSize: "65px" }} />
                    </div>
                    <TextField.Root
                      placeholder="Ваша пошта..."
                      size="2"
                      className="login__textfield"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                    >
                      <TextField.Slot>
                        <PersonIcon />
                      </TextField.Slot>
                    </TextField.Root>
                    <TextField.Root
                      placeholder="Ваш пароль..."
                      size="2"
                      type="password"
                      className="login__textfield"
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                    >
                      <TextField.Slot>
                        <InputIcon />
                      </TextField.Slot>
                    </TextField.Root>
                    <Button
                      size="2"
                      className="login__button"
                      onClick={signIn}
                      loading={loginLoading}
                    >
                      Увійти
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
              {mode === "signup" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="login__content"
                  >
                    <div className="login__avatar">
                      <AddBoxRoundedIcon sx={{ fontSize: "65px" }} />
                    </div>
                    <TextField.Root
                      placeholder="Ваша пошта..."
                      size="2"
                      className="login__textfield"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                    >
                      <TextField.Slot>
                        <PersonIcon />
                      </TextField.Slot>
                    </TextField.Root>
                    <TextField.Root
                      placeholder="Ваш пароль..."
                      size="2"
                      type="password"
                      className="login__textfield"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                    >
                      <TextField.Slot>
                        <InputIcon />
                      </TextField.Slot>
                    </TextField.Root>
                    <Button
                      size="2"
                      className="login__button"
                      onClick={signUp}
                      loading={signupLoading}
                    >
                      Зареєструватися
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
