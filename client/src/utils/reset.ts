import { useDispatch } from "react-redux";
import { removeUser } from "../redux/features/feature.auth";
import { useEffect } from "react";

export const reset = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(removeUser());
    }, [])

}
