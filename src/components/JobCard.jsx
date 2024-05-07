import React from 'react'
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import './styles.css'
import PropTypes from 'prop-types';
import currencySymbolMap from 'currency-symbol-map';



// { postedOn, companyLogo, companyName, payRange, aboutCompany, experienceRequired }
export default function JobCard({ job }) {
  const { companyName,
    jdLink,
    jobDetailsFromCompany,
    jobRole,
    location,
    logoUrl,
    maxExp,
    maxJdSalary,
    minExp,
    minJdSalary,
    salaryCurrencyCode } = job;
  return (
    <Card className='job-card' sx={{ paddingBottom: '0px' }}>
      <div className='job-card-content'>
        <Typography
          top={20} left={16} fontSize={12} color="text.secondary" height={14} alignContent={'center'} fontWeight={600}
          border="1px solid #ccc" padding="5px 10px" borderRadius={20} display={'inline-block'} position={'absolute'} boxShadow={'0 2px 4px rgba(0, 0, 0, 0.1)'}>
          ⏳ Posted 10 days ago
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '48px', textTransform: 'capitalize' }}>
          <img src={logoUrl} alt="Company Logo" style={{ width: 48, height: 48, marginRight: 10, padding: 8 }} />
          <div style={{ display: 'flex', flexDirection: 'column', padding: 8, alignItems: 'flex-start', textTransform: 'capitalize' }}>
            <Typography variant="body1" sx={{ fontWeight: '700', color: 'gray', fontSize: '14px' }}>{companyName}</Typography>
            <Typography variant="body1" sx={{ fontWeight: '500', fontSize: '14px' }}>{jobRole}</Typography>
            <Typography variant="body1" sx={{ fontWeight: '500', fontSize: '14px' }}>{location}</Typography>
          </div>
        </div>
        {minJdSalary || maxJdSalary ? <Typography sx={{ padding: '8px', fontWeight: '700', color: 'GrayText', fontSize: '14px', marginTop: '10px' }}>Estimated Salary: {currencySymbolMap(salaryCurrencyCode)}{minJdSalary && maxJdSalary ? (minJdSalary + '-' + maxJdSalary) : (minJdSalary ? minJdSalary : maxJdSalary)} LPA</Typography> : null}
        <Typography variant='h6' sx={{ marginTop: '16px', padding: '8px' }}>
          Job Details:
        </Typography>
        <Typography sx={{
          padding: '8px',
          position: 'relative',
          '&::after': {
            content: "''",
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            pointerEvents: 'none',
          }
        }
        } fontFamily='serif'>
          {jobDetailsFromCompany}
          <a href={jdLink} target="_blank" rel="noopener noreferrer" className="view-details-link">
            <span style={{ color: 'blue', fontWeight: '500' }}>View Job</span>
          </a>
        </Typography>
      </div>
      {<div style={{ margin: '8px', fontWeight: '700', color: 'gray', fontSize: '14px', marginTop: '8px' }}> Minimum Experience
        <span style={{ fontWeight: '500', color: 'black', fontSize: '14px', display: 'block' }}>{minExp ? minExp : '0'} Years</span>  </div>}
      <div className='card-actions-container'>
        <Button sx={{ margin: '5px', height: '48px', backgroundColor: 'cyan', fontWeight: '700', textTransform: 'capitalize', color: 'black', borderRadius: '10px' }} >⚡ Easy Apply</Button>
        <Button sx={{
          margin: '5px', height: '48px', backgroundColor: '#4942E4', fontWeight: '500', textTransform: 'capitalize', color: 'white', borderRadius: '10px', transition: 'color 0.3s',
          ':hover': {
            color: 'black',
          }
        }}>
          <img className='ref-avatar' src='avatarPic.jpg' alt='' />
          <img className='ref-avatar' src='avatarPic.jpg' alt='' />
          Unlock referral asks</Button>
      </div>
    </Card>
  )
}

JobCard.propTypes = {
  job: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    jdLink: PropTypes.string.isRequired,
    jdUid: PropTypes.string.isRequired,
    jobDetailsFromCompany: PropTypes.string.isRequired,
    jobRole: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    maxExp: PropTypes.number.isRequired,
    maxJdSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]).isRequired,
    minExp: PropTypes.number.isRequired,
    minJdSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]).isRequired,
    salaryCurrencyCode: PropTypes.string.isRequired,
  }).isRequired,
};


