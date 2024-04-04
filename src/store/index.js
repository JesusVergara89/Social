import { configureStore } from '@reduxjs/toolkit'
import request from './slices/request.slice.js'
import postnumber from './slices/post.slice.js'

export default configureStore({
    reducer: {
        request,
        postnumber
    }
})