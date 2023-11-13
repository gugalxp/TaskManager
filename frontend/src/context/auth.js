// auth.js

import React, { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import { api } from "../../src/services/apiClient";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState();
    const [userAuth, setUserAuth] = useState(() => {
        const { "@todoList": token } = parseCookies();
        return !!token;
    });

    useEffect(() => {
        const { "@todoList": token } = parseCookies();
        if (token) {
            setUserAuth(true)
            api
                .get(`/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((response) => {
                    const { id } = response.data;
                    // console.log("ID: ", id)
                    setUserId(id)
                })
                .catch((err) => {
                    signOut();
                });
        }
    }, [userId]);

    async function signUp(email, password, confirmedPassword, name) {
        try {
            if (confirmedPassword === password) {
                const response = await api.post("/users", {
                    email,
                    password,
                    name,
                });

                if (response.data.id) {
                    toast.success("Cadastrado efetuado com sucesso!");
                    return true;
                }
            } else {
                toast.error("As senhas inseridas não coincidem!");
                return false;
            }
            return true;
        } catch (error) {
            toast.error(error);
            return false;
        }
    }

    const signOut = async () => {
        destroyCookie(null, "@todoList", { path: "/" });
        setUserAuth(false);
    }

    const signIn = async (emailUser, password) => {

        try {
            const response = await api.post('/auth', { email: emailUser, password });

            if (response.data.message === "Email/senha incorreto") {
                toast.error("Email/senha incorreto");
                return false;
            }

            const { id, name, email, token } = response.data;
            // console.log(token)
            setUserId(id)
            setUserAuth(true);

            setCookie(undefined, "@todoList", token, {
                maxAge: 3600, // expirar em 1h
                path: "/",
            });

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            toast.success("Login efetuado com sucesso!");
            return true;

        } catch (error) {
            console.error('Erro ao fazer login:', error.message);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            signed: !!userAuth,
            userAuth,
            signIn,
            setUserAuth,
            signOut,
            signUp,
            setUserId,
            userId
        }}>
            {children}
        </AuthContext.Provider>
    );
}
