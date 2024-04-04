import { configureStore } from '@reduxjs/toolkit'
import request from './slices/request.slice.js'

export default configureStore({
    reducer: {
        request
    }
})