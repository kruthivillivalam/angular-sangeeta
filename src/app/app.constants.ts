export const COUNTRY = "Australia";
export const PERPAGE = "10";
export const ISADAPTIVE = true;
export const CURRENYNAME = 'AUD';
export const CURRENYSYMBOL = '$';

export const LOGINPAGE = {
    LOGIN_HEADER : 'Log In',
    REMEMBER_ME_TXT : 'Remember Me',
    FORGOT_PWD_TXT : 'Forgot Your Password?',
    NOT_MEMBER_TXT : 'Not member yet !'
}

export const COMMONTEXT = {
    REG_WITH_FB_BTN_TXT : 'Register with Facebook',
    REG_WITH_GOOGLE_BTN_TXT : 'Register with Google',
    REG_WITH_TWTR_BTN_TXT : 'Register with Twitter',
    HOME_TXT : 'Home',
    LOGIN_TXT : 'Log In',
    SIGNUP_TXT : 'Sign Up',
    REG_TXT : 'Register',
    CANCEL_TXT : 'Cancel',
    REG_NOW_TXT : 'Register Now',
    TRMS_N_COND_BTN_TXT : 'Terms And Conditions',
    TRMS_N_COND_CONT_TXT : 'Terms and conditions text content',
    POST_TXT : 'Post',
    NO_RESULT : 'No food items found.',
    REVIEW_POSTED_PUBLICALLY : 'Your review will be posted publicly on the web.',
    ALERT_TITLE :  'Alert'
}

export const VALIDATIONERROR = {
    EMAIL_REQ_ERR : 'Email is required.',
    EMAIL_INVALID_ERR : 'Email is Invalid.',
    EMAIL_NOT_FOUND : 'Email does not exist',
    PWD_REQ_ERR : 'Password is required.',
    PWD_LEN_ERR : 'Password must be at least 6 characters long.',
    PWD_MISSMATCH_ERR : 'Password mismatch.',
    USER_NOT_FOUND_ERR : 'Invalid credentials !',
    FIRST_NAME_REQ_ERR : 'First name is required.',
    FIRST_NAME_ALPHA_ERR : 'Only alphabets are allowed in first name.',
    LAST_NAME_REQ_ERR : 'Last name is required.',
    LAST_NAME_ALPHA_ERR : 'Only alphabets are allowed in last name.',
    MOBILE_REQ_ERR : 'Mobile is required.',
    MOBILE_LEN_ERR : 'Mobile Number must be at least 10 number long.',
    MOBILE_INVALID_ERR : 'Mobile is invalid.',
    PLS_AGREE_ERR : ' Please agree Ordepoint terms and conditions',
    MOBILE_NO_NOT_FOUND : 'Mobile number dose not exist',
    RES_DATE_VALID_ERROR : 'Reservation date should be a future date',
    PRE_DATE_VALID_ERROR : 'Pre-Order date should be a future date or today',
    PRE_TIME_VALID_ERROR : 'Order time should fall under servicable time and should be future time',
    COMMENT_EMPTY_ERR : 'Please enter review title, review comments and do not forget to give rating',
    COMMENT_EMPTY_TITLE : 'Please Add Review'
}

export const REGISTERPAGE = {
    REG_HEADER : 'Sign Up',
    REG_DOB_TXT : 'Date of Birth',
    STATE_TXT : 'State',
    COUNTRY_TXT : 'Country',
    I_AGREE_TXT : 'I agree to the Orderpoint',
    TERMS_N_COND_TXT : 'terms and conditions',
    ALRDY_MBR_TXT : 'Already member!'
};

export const THRIDPARTYAPI = {
    TWILIO_PHONE_NO_LOOKUP : 'https://lookups.twilio.com/v1/PhoneNumbers/',
    TWILIO_AccountSid : 'AC317c2808c530aede7f37e5c328dcffe1',
    TWILIO_AuthToken : '35fd426b334bb4741d95b7b68efdd47d',
    MSFT_TEXT_ANALYSIS_API :  'https://australiaeast.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
    MSFT_SUBSCR_KEY : 'df8972cf5cea49f19e9a2c524c04dc48',
    MAILGUN_EMAIL_VALIDATION : 'https://api.mailgun.net/v3/address/validate?address=',
    MAILGUN_KEY : 'pubkey-a506f76a844ea10c93a22c29c3856dd1',
    STRIPE_API : 'https://api.stripe.com/v1/charges',
    STRIPE_API_KEY : 'sk_test_lLOrXDqLzYWlKmd5Gqb3PrrD'
}

export const ALERTMSGS = {
    RES_FAILED : 'Reservation Failed',
    RES_DONE : 'Reservation Done',
    RES_FAILED_MSG : 'Reservation failed. Please try again.',
    RES_SUC_MSG : 'Your reservation is successful.',
    PLS_TRY_AGN : 'Please try again!',
    SMTHNG_WRNG : 'Something went wrong. Please try again!',
    POSTCMNT_SUC_TITLE : 'Review Posted',
    POSTCMNT_SUC_MSG : 'Thanks for your feedback!',
    PLS_ADD_QTY : 'Please add quantity',
    PLS_SLCT_ORDRTYPE : 'Please select order type',
    POSTCMNT_FAIL_TITLE : 'Review Posting Failed',
    POSTCMNT_FAIL_MSG : 'Review not posted due to some error!',
}

export const MYPROFILEPAGEALERTMSGS = {
    MYPROFILE_REQUEST_FAILED : 'My Profile Request Failed',
    MYPROFILE_REQUEST_FAILED_MSG : 'My Profile request failed. Please try again.',
    MYPROFILE_REQUEST_DONE:'Profile Updation',
    MYPROFILE_REQUEST_SUC_MSG: "Your profile detail's successfully updated.",
    MYPROFILE_CHNGPASS_REQUEST_FAILED : 'Password Change Request Failed',
    MYPROFILE_CHNGPASS_REQUEST_FAILED_MSG : 'Password change request failed. Please try again.',
    MYPROFILE_CHNGPASS_REQUEST_SUC_MSG:'Your password is changed successfully.',
    MYPROFILE_CHNGPASS_REQUEST_DONE:'Password Change'    
}

export const MYRESERVATIONPAGEALERTMSGS = {
    MYRESERVATION_REQUEST_FAILED : 'My Reservation Request Failed',
    MYRESERVATION_REQUEST_FAILED_MSG : 'My Reservation request failed. Please try again.',
}
export const MYONLINEORDERHISTORYPAGEALERTMSGS = {
    MYONLINEORDERHISTORY_REQUEST_FAILED : 'My Online Order History Request Failed',
    MYONLINEORDERHISTORY_REQUEST_FAILED_MSG : 'My Online Order History request failed. Please try again.',
}
export const MYDINEORDERHISTORYPAGEALERTMSGS = {
    MYDINEORDERHISTORY_REQUEST_FAILED : 'My Dine Order History Request Failed',
    MYDINEORDERHISTORY_REQUEST_FAILED_MSG : 'My Dine Order History request failed. Please try again.',
}
export const MYFAVOURITESPAGEALERTMSGS = {
    MYFAVOURITES_REQUEST_FAILED : 'My Favourites Request Failed',
    MYFAVOURITES_REQUEST_FAILED_MSG : 'My favourites request failed. Please try again.',
}
export const MYTRACKORDERPAGEALERTMSGS = {
    MYTRACKORDER_REQUEST_FAILED : 'My Track Order Request Failed',
    MYTRACKORDER_REQUEST_FAILED_MSG : 'My track order request failed. Please try again.',
}
export const MYREVIEWSPAGEALERTMSGS = {
    MYREVIEWS_REQUEST_FAILED : 'My Reviews Request Failed',
    MYREVIEWS_REQUEST_FAILED_MSG : 'My Reviews request failed. Please try again.',
}
export const MYBENEFITSPAGEALERTMSGS = {
    MYBENEFITS_REQUEST_FAILED : 'My Benefits Request Failed',
    MYBENEFITS_REQUEST_FAILED_MSG : 'My Benefits request failed. Please try again.',
}
