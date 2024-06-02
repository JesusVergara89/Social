import React from 'react';
import './Individualstory.css';
import { useDispatch } from 'react-redux';
import { setIsActive, setItems } from '../../store/slices/stories.slice';

const Individualstory = ({ story, group }) => {
  const dispatch = useDispatch();

  const handleSetItems = (value) => dispatch(setItems(value));
  const handleSetActivate = (value) => dispatch(setIsActive(value));

  const convertTimestampToDate = (timestamp) => {
    const seconds = timestamp.seconds;
    const milliseconds = seconds * 1000;
    return new Date(milliseconds).toISOString();
  }

  const functionCheck = () => {
    const groupWithDate = group.map(item => ({
      ...item,
      createdAt: convertTimestampToDate(item.createdAt)
    }));
    handleSetItems(groupWithDate);
    handleSetActivate(true);
  }

  return (
    <div onClick={functionCheck} className='Individualstory'>
      <img src={story.image} alt="" />
      <h6>{story.userName !== null ? story.userName : ''}</h6>
    </div>
  );
}

export default Individualstory;
