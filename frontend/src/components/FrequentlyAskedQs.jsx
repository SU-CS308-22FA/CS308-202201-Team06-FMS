import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import '../faq-css.css';

const FAQ = () => {
    const [triggered,setTrigger] = useState(false);

    const handleOpen = () => {
        setTrigger(true);
      }
      
    const handleClose = () => {
        setTrigger(false);
      }

    return(
        <Popup trigger={<button className="button"> FAQs </button>} position='right top' on='click'
        open={triggered}
        onOpen={handleOpen}>
        <div className='rows has-background-light popup'>
            <div className='popup-header columns'><h3>Frequently Asked Questions</h3> <button onClick={handleClose}>X</button></div>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
            <h1 className='question'><b>-What is FMS?</b></h1>
            <p className='answer'>FMS is financial management system for federation and clubs in order to manage financial data and assest easily and properly.</p>
        </div>
      </Popup>
    );
}

export default FAQ;

