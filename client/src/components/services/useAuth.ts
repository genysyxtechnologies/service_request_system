import { useState } from "react";
import { AxiosData, AxiosError, ROLES, SignIn, SignUp } from "../../utils/types";
import { AuthRepository } from "../../repositories/auth.repository";
import { useDispatch } from "react-redux";
import { addToken, addUser, setIsAdmin } from "../../redux/features/feature.auth";
import { useNavigate } from "react-router-dom";
import { reset } from "../../utils/reset";
import { toast } from 'sonner'

export const useAuth = () => {
    reset();
    const [user, setUser] = useState<SignUp>({ firstName: "", lastName: "", username: "", email: "", password: "" });
    const [token, setToken] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [signUser, setSignUser] = useState<SignIn>({ identifier: "", password: "" });
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // reset user data
    const resetUserData = () => {
        setUser({ firstName: "", lastName: "", username: "", email: "", password: "" });
        setSignUser({ identifier: "", password: "" });
    }

    const validateSignUp = (): boolean => {
        const errors: Record<string, string> = {};
        if (!user.firstName.trim()) errors.firstName = "First name is required";
        if (!user.lastName.trim()) errors.lastName = "Last name is required";
        if (!user.username.trim()) errors.username = "Username is required";
        if (!user.email.trim()) errors.email = "Email is required";
        if (!user.password.trim()) errors.password = "Password is required";
        if (user.password.length < 6) errors.password = "Password must be at least 6 characters";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateSignIn = (): boolean => {
        const errors: Record<string, string> = {};
        if (!signUser.identifier.trim()) errors.identifier = "Identifier is required";
        if (!signUser.password.trim()) errors.password = "Password is required";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const signup = async () => {
        if (!validateSignUp()) return;

        setLoading(true);
        const auth = new AuthRepository();
        try {
            await auth.signup(user);
            setLoading(false);
            setIsSignUp(false);
            setIsSignIn(true);
            toast.success('Account created successfully!');
        } catch (error) {
            setError(error);
            setLoading(false);
            toast.error('Signup failed. Please try again.');
        }
        finally {
            resetUserData();
        }
    }

    const signin = async () => {
        if (!validateSignIn()) return;

        setLoading(true);
        const auth = new AuthRepository();
        try {
            const response = await auth.signin(signUser);
            setLoading(false);
            setIsAuthenticated(true);
            if ((response as AxiosData).status === 200) {
                toast.success('Successfully logged in!');
                dispatch(addUser((response as AxiosData).data.user));
                dispatch(addToken((response as AxiosData).data.token));
                !(response as AxiosData).data.user.roles.includes(ROLES.DEFAULT_ROLE) && dispatch(setIsAdmin(true));
                navigate('/app');
            } else {
                toast.error((response as AxiosError).response.data.message || 'an error occured!');
            }
        } catch (error) {
            setError(error);
            setLoading(false);
            toast.error('Login failed. Please check your credentials.');
        }
        finally {
            resetUserData();
        }
    }

    return {
        user,
        signUser,
        setSignUser,
        setUser,
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        error,
        signup,
        signin,
        isSignIn,
        isSignUp,
        setIsSignIn,
        setIsSignUp,
        fieldErrors
    }
}