import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../redux/jobSlice';
import JobCard from './JobCard';
import './styles.css';


export default function Dashboard() {
    const dispatch = useDispatch();
    const jobData = useSelector((state) => state.jobs.jobData);
    const loading = useSelector((state) => state.jobs.loading);
    const error = useSelector((state) => state.jobs.error);

    useEffect(() => {
        dispatch(fetchJobData());
    }, [dispatch]);

    console.log('jobdata---------->', jobData)

    return (
        <>
            <div className="dashboard-container">

                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {jobData.map((job) => (
                    <JobCard key={job.jdUid} job={job} />
                ))}
            </div>
        </>
    )
}
