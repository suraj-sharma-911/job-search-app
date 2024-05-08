// jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchJobData = createAsyncThunk(
    'jobs/fetchJobData',
    async ({ offset, limit }) => {
        // let cancel
        const response = await axios.post(
            'https://api.weekday.technology/adhoc/getSampleJdJSON',
            { limit, offset },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // cancelToken: new axios.CancelToken(c => cancel=c)
            },
        );
        console.log(offset, limit)
        // return ()=>cancel();
        return response.data;
    }
);
const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobData: [],
        loading: false,
        error: null,
        offset: 0,
        limit: 10,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobData.fulfilled, (state, action) => {
                state.loading = false;
                // state.jobData = action.payload.jdList;
                state.jobData = removeDuplicates([...state.jobData, ...action.payload.jdList]);
                state.hasMore = action.payload.jdList.length > 0;
                state.offset+=state.limit
                state.error = null;
            })
            .addCase(fetchJobData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});


const removeDuplicates = (data) => {
    const uniqueKeys = new Set();
    return data.filter(item => {
        const key = item.jdUid;
        if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key);
            return true;
        }
        return false;
    });
};

export default jobSlice.reducer;
