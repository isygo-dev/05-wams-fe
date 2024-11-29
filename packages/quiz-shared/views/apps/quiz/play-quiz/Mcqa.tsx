import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import React, {useState} from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import FormControl from "@mui/material/FormControl";
import {Controller} from "react-hook-form";

const Mcqa = ({control, options, selectedOptionId, setSelectedOptionId}) => {

    const [textValues, setTextValues] = useState({})

    const handleOptionChange = (event) => {
        setSelectedOptionId(event.target.value)
    }

    const handleTextChange = (optionId, value) => {
        setTextValues({...textValues, [optionId]: value})
    }

    return (
        <FormControl>
            <RadioGroup value={selectedOptionId} onChange={handleOptionChange}>
                {options.map((option) => (
                    <Box key={option.id}>
                        <FormControlLabel
                            value={option.id.toString()}
                            control={<Radio/>}
                            label={option.option}
                        />
                        {selectedOptionId === option.id.toString() && (
                            <Box mt={2}>
                                <Controller
                                    name='answerText'
                                    control={control}
                                    rules={{required: true}}
                                    defaultValue=""
                                    render={({field: {onChange}}) => (
                                        <TextField
                                            label="Type your response"
                                            multiline
                                            rows={4}
                                            value={textValues[option.id] || ''}
                                            onChange={(e) => {
                                                onChange(e);
                                                handleTextChange(option.id, e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        )}
                    </Box>
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default Mcqa
