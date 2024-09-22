import axios from "axios";

 interface UserProps {
   id: number;
   name: string;
   email: string;
   email_verified_at?: Date;
   two_factor_confirmed_at?: Date;
   two_factor_recovery_codes?: number;
   two_factor_secret: string;
   created_at: Date;
   updated_at: Date;
 }

 interface PayloadProps {
   name: string;
   email: string;
   password: string;
   password_confirmation: string;
 }

const user = ref<UserProps | null>(null);

export const useAuth = () => {
  interface LoginProps {
    email: string;
    password: string;
  }

  async function login(payload: LoginProps) {
    await axios.post("/login", payload);
    useRouter().push("/me");
  }

  async function logout() {
    await axios.post("/logout");
    user.value = null;
    useRouter().replace("/login");
  }

  async function register(payload: PayloadProps) {
    await axios.post("/register", payload);
    await login({
      email: payload.email,
      password: payload.password,
    });
  }

  async function getUser(): Promise<UserProps | null> {
    if (user.value) return user.value;
    try {
      const res = await axios.get("/user");
      const user = res.data;
      return {
        ...user,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
        two_factor_confirmed_at: user.two_factor_confirmed_at 
          ? new Date(user.two_factor_confirmed_at) 
          : null,
        email_verified_at: user.email_verified_at
          ? new Date(user.email_verified_at)
          : null
      }
    } catch (err) {
      return null;
    }
  }

  async function initUser() {
    user.value = await getUser()
  }

  return { user, login, logout, register, initUser }
}