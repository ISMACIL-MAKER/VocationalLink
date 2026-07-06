import {configureStore} from "@reduxjs/toolkit"
import Jopreducer from "../features/JopSlice"
export const store=configureStore({
    reducer:{

        JOP:Jopreducer

    }
})