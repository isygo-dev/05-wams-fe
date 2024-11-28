// ** MUI Imports
import Box, {BoxProps} from '@mui/material/Box'

// ** Icon Imports
import React from "react";
import {styled} from "@mui/material/styles";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";

interface FloatingButtonProps {
    actions: {
        icon: JSX.Element,
        name: string,
        onClick: () => void
    }[]
}

const Toggler = styled(Box)<BoxProps>(({theme}) => ({
    right: 0,
    bottom: '9vh',
    display: 'flex',
    position: 'fixed',
    padding: theme.spacing(2),
    zIndex: theme.zIndex.modal + 100,
    transform: 'translateY(-80%)',
}))
const CommonFloatingButton = (props: FloatingButtonProps) => {
    const {actions} = props;

    return (
        <Toggler>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16, transform: 'translateZ(0px)'}}
                icon={<SpeedDialIcon/>}>
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.onClick}
                    />
                ))}
            </SpeedDial>
        </Toggler>
    )
}

export default CommonFloatingButton
