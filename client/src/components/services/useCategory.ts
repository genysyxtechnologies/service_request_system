import { useState } from "react";
import { CategoryRepository } from "../../repositories/category.repository";
import { AxiosData, AxiosError, Category, NewCategory } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";
import { toast } from 'sonner'

export const useCategory = (token: string, isAdmin: boolean) => {
    const category = new CategoryRepository(token);
    const [categories, setCategories] = useState<NewCategory>({ name: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | any>('');
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState(0);
    const [updateValue, setUpdateValue] = useState<string>("");

    // CREATE category
    const createCategory = async () => {
        setLoading(true);
        try {
            const response = await category.createService(ENDPOINTS.CREATE_CATEGORY, categories);
            if ((response as AxiosData).status === 200) {
                setLoading(false);
                setIsCreated(true);
            }
            else {
                setIsCreated(false);
                toast.error((response as AxiosError).message)
                setError((response as AxiosError).message)
            }
        } catch (error) {
            return error;
        }
        finally {
            setLoading(false);
            await fetchCategories();
        }
    }

    // GET categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await category.getServices(isAdmin ? ENDPOINTS.GET_CATEGORIES : ENDPOINTS.GET_REQUESTER_CATEGORIES);
            if ((response as AxiosData).status === 200) {
                setAllCategories((response as AxiosData).data as Category[])
                return (response as AxiosData).data as Category[]
            }
            else {
                return toast.error((response as AxiosError).message)
            }

        } catch (error) {
            return error;
        }
        finally {
            setLoading(false);
            console.log('function ran')
        }
    }
    // UPDATE category
    const updateCategory = async () => {
        console.log(updateValue, categoryId)
        try {
            const response = await category.updateCategory(`${ENDPOINTS.UPDATE_CATEGORY}/${categoryId}`, { name: updateValue });
            console.log(response);
        } catch (error) {
            console.log(error);
            return error;
        }
        finally {
            await fetchCategories();
        }
    }

    return { categories, setCategories, error, loading, createCategory, isCreated, allCategories, fetchCategories, updateCategory, updateValue, setUpdateValue, setCategoryId, categoryId }
}