import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../redux/jobSlice';
import JobCard from './JobCard';
import './styles.css';
import { FormControl, MenuItem, Select, TextField, IconButton } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import RefreshIcon from '@mui/icons-material/Refresh';




export default function Dashboard() {
    const dispatch = useDispatch();
    const jobData = useSelector((state) => state.jobs.jobData);
    const loading = useSelector((state) => state.jobs.loading);
    const error = useSelector((state) => state.jobs.error);

    useEffect(() => {
        dispatch(fetchJobData());
    }, [dispatch]);

    const uniqueRoles = new Set();
    const uniqueCompanyNames = new Set();
    const uniqueMinSalaries = new Set();
    const uniqueMinYears = new Set();

    jobData.forEach(job => {
        uniqueRoles.add(job.jobRole);
        uniqueCompanyNames.add(job.companyName);
        if (job.maxJdSalary) {
            uniqueMinSalaries.add(job.minJdSalary ? job.minJdSalary : job.maxJdSalary);
        }
        if (job.minExp) {
            uniqueMinYears.add(job.minExp);
        }
    });

    const [filters, setFilters] = useState({
        roles: '',
        experience: '',
        minSalary: '',
        searchQuery: '',
    });

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    useEffect(() => {
    }, [filters]);

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            searchQuery: value
        }));
    };
    const filteredJobData = jobData.filter(job => {
        const { companyName, jobRole, minExp, minJdSalary } = job;
        const { searchQuery, roles, experience, minSalary } = filters;
        let rolesFlag = true;
        let experienceFlag = true;
        let minSalaryFlag = true;
        let searchFlag = true;

        if (roles && roles !== "") {
            rolesFlag = jobRole.toLowerCase() === roles.toLocaleLowerCase();
        } if (experience && experience !== "") {
            experienceFlag = Number(minExp) === Number(experience);
        }
        if (minSalary && minSalary !== "") {
            minSalaryFlag = Number(minSalary) === Number(minJdSalary);
        }
        if (searchQuery && searchQuery !== "" ) {
            searchFlag = companyName.toLowerCase().includes(searchQuery.toLowerCase())
        }

        return rolesFlag && experienceFlag && minSalaryFlag && searchFlag;
    });

    const handleRefresh = () => {
        setFilters({
            roles: '',
            experience: '',
            minSalary: '',
            searchQuery: ''
        });
    };

    return (
        <>
            <div >
                <div
                    style={{ position: 'sticky', top: '0', zIndex: '100', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', padding: '10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FormControl sx={{ m: 5, width: '300px' }}>
                            <InputLabel id="roles">Roles</InputLabel>
                            <Select id='roles' label="Roles" value={filters.roles} onChange={(e) => handleFilterChange('roles', e.target.value)}>
                                {Array.from(uniqueRoles).map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 5, width: '300px' }}>
                            <InputLabel id="experience">Experience</InputLabel>
                            <Select id='experience' label="experience" value={filters.experience} onChange={(e) => handleFilterChange('experience', e.target.value)}>
                                {Array.from(uniqueMinYears).sort((a, b) => { return a - b }).map((exp) => (
                                    <MenuItem key={exp} value={exp}>{exp}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 5, width: '300px' }}>
                            <InputLabel id="minSalary">Minimum Base Pay Salary</InputLabel>
                            <Select id='minSalary' label="Minimum Base Pay Salary" value={filters.minSalary} onChange={(e) => handleFilterChange('minSalary', e.target.value)}>
                                {Array.from(uniqueMinSalaries).sort((a, b) => { return a - b }).map((salary) => (
                                    <MenuItem key={salary} value={salary}>{salary}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                sx={{ m: 5, width: '300px' }}
                                id="outlined-basic"
                                label="Search"
                                variant="outlined"
                                value={filters.searchQuery}
                                onChange={handleSearchChange}
                            />
                            <IconButton onClick={handleRefresh} sx={{ p: '10px', right: '5px' }}>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </div>


                </div>
                <div className="dashboard-container">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {filteredJobData ? (filteredJobData.length > 0 ? filteredJobData.map((job) => (<JobCard key={job.jdUid} job={job} />)) : <p>No data Found</p>) : jobData.map((job) => (
                        <JobCard key={job.jdUid} job={job} />
                    ))}
                </div>
            </div>

        </>
    )
}
