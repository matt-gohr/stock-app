import React from 'react';
import TextInput from './TextInput';
import Checkbox from './Checkbox';
import Radio from './Radio';

const renderFields = (props) => (

  <div>

    { (props.type === 'name' ||

       props.type === 'email' ||

       props.type === 'password' ||

       props.type === 'number') &&

      <TextInput {...props} />

    }

    { props.type === 'checkbox' && <Checkbox {...props} /> }

    { props.type === 'radio' && <Radio {...props} /> }

  </div>

);

export default renderFields;