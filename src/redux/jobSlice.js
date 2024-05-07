// jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchJobData = createAsyncThunk(
    'jobs/fetchJobData',
    async () => {
        const options = {
            method: 'POST',
            url: "https://api.weekday.technology/adhoc/getSampleJdJSON",
            body: {
                "limit": 10,
                "offset": 0
            },
            headers: {
                "Content-Type": "application/json",
            }
        }
        const response = await axios(options);
        return response.data.jdList;
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobData: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobData.fulfilled, (state, action) => {
                state.loading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(fetchJobData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default jobSlice.reducer;
