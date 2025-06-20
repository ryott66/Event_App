import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";


//Reactのコンテキスト機能　createとuseで共有
type AuthContextType = {
    token: string | null;
    userId: string | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    //Token取得
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [userId, setUserId] = useState<string | null>(null);

    //ユーザID取得
    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);
            setUserId(decoded.user_id);
        }
    }, [token]);


    const login = (access: string, refresh: string) => {
        localStorage.setItem("token", access);
        localStorage.setItem("refresh_token", refresh);
        setToken(access);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// export const useAuth = () => useContext(AuthContext);
// 呼び出し側でnull考慮しなくていいように変更
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};