import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../redux/jobSlice';
import JobCard from './JobCard';
import './styles.css';
import { FormControl, MenuItem, Select, TextField, IconButton, Box, Tooltip } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { v4 as uuidv4 } from 'uuid';


export default function Dashboard() {
    const dispatch = useDispatch();
    const { jobData, loading, offset, limit, error, hasMore } = useSelector((state) => state.jobs);
    const [initialDispatchDone, setInitialDispatchDone] = useState(false);

    const observer = useRef();
    useEffect(() => {
        if (!initialDispatchDone) {
            dispatch(fetchJobData({ offset, limit }));
            setInitialDispatchDone(true);
        }
    }, [dispatch, offset, limit, initialDispatchDone]);

    const lastJobElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                dispatch(fetchJobData({ offset: offset + limit, limit }));
            }
        })
        if (node) observer.current.observe(node);
    }, [jobData, loading, hasMore]);

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
        if (searchQuery && searchQuery !== "") {
            searchFlag = companyName.toLowerCase().includes(searchQuery.toLowerCase())
        }
        let filterResult = rolesFlag && experienceFlag && minSalaryFlag && searchFlag;
        // setFilterActive(filterResult)
        return filterResult;
    });

    const handleRefresh = () => {
        setFilters({
            roles: '',
            experience: '',
            minSalary: '',
            searchQuery: ''
        });
        // setFilterActive(false)

    };

    return (
        <>
            <div
                style={{ position: 'sticky', top: '0', zIndex: '100', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(5px)', padding: '10px 0' }}>
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                    <FormControl sx={{ m: 1, minWidth: '200px' }}>
                        <InputLabel id="roles">Roles</InputLabel>
                        <Select id='roles' label="Roles" value={filters.roles} onChange={(e) => handleFilterChange('roles', e.target.value)}>
                            {Array.from(uniqueRoles).map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: '200px' }}>
                        <InputLabel id="experience">Experience</InputLabel>
                        <Select id='experience' label="experience" value={filters.experience} onChange={(e) => handleFilterChange('experience', e.target.value)}>
                            {Array.from(uniqueMinYears).sort((a, b) => { return a - b }).map((exp) => (
                                <MenuItem key={exp} value={exp}>{exp}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: '200px' }}>
                        <InputLabel id="minSalary">Minimum Base Pay Salary</InputLabel>
                        <Select id='minSalary' label="Minimum Base Pay Salary" value={filters.minSalary} onChange={(e) => handleFilterChange('minSalary', e.target.value)}>
                            {Array.from(uniqueMinSalaries).sort((a, b) => { return a - b }).map((salary) => (
                                <MenuItem key={salary} value={salary}>{salary}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            sx={{ m: 1, width: '100%' }}
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            value={filters.searchQuery}
                            onChange={handleSearchChange}
                        ></TextField>
                        <Tooltip title="Refresh Filters">
                            <IconButton onClick={handleRefresh} sx={{ p: '10px', minWidth: 'auto' }}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Box>


            </div>
            <div className="dashboard-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {filteredJobData ? (filteredJobData.length > 0 ? filteredJobData.map((job) => (<JobCard key={job.jdUid} job={job} />)) : <p>No data Found</p>) :
                    jobData.map((job, index) => {
                        if (jobData.length === index + 1) (<div id={job.jdUid} key={uuidv4()}>
                            <JobCard job={job} />
                        </div>)
                    })
                }
                <div ref={lastJobElementRef}>{loading && <div>Loading...</div>}</div>
            </div>

        </>
    )
}
