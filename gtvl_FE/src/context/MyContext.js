import React, { createContext, useReducer } from "react";
import { useEffect } from "react";

const initialState = {
  isAuthenticated: false,
  user: {
    username: null,
    avatar: "", // Khởi tạo avatar là chuỗi rỗng
    role: null,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuthenticated: true,
        user: {
          username: action.payload.username,
          avatar: action.payload.avatar, // Thêm trường avatar
          role: action.payload.role,
        },
      };
    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const MyContext = createContext(initialState);

const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MyContext.Provider value={[state, dispatch]}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
