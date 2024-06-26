import { configureStore } from '@reduxjs/toolkit'
import request from './slices/request.slice.js'
import conectionNumber from './slices/conections.slice.js'
import postNumber from './slices/postnumber.slice.js'
import countermsg from './slices/countermsg.slice.js'
import story from './slices/stories.slice.js'

export default configureStore({
    reducer: {
        request,
        conectionNumber,
        postNumber,
        countermsg,
        story
    }
})