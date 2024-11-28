// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const TextareaBasic = () => {
    return (
        <form noValidate autoComplete='off'>
            <Grid container spacing={4}>
                <Grid item>
                    <Typography sx={{mb: 2, fontWeight: 500}}>Simple</Typography>
                    <TextareaAutosize
                        aria-label='empty textarea'
                        placeholder='Empty'
                        onResize={undefined}
                        onResizeCapture={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Grid>
                <Grid item>
                    <Typography sx={{mb: 2, fontWeight: 500}}>Minimum Rows</Typography>
                    <TextareaAutosize
                        aria-label='minimum height'
                        minRows={3}
                        placeholder='Minimum 3 rows'
                        onResize={undefined}
                        onResizeCapture={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Grid>
                <Grid item>
                    <Typography sx={{mb: 2, fontWeight: 500}}>Maximum Rows</Typography>
                    <TextareaAutosize
                        maxRows={4}
                        aria-label='maximum height'
                        placeholder='Maximum 4 rows'
                        defaultValue='Cupcake ipsum dolor sit amet wafer halvah ice cream. Macaroon bear claw pudding cheesecake. Chupa chups powder soufflé powder.'
                        onResize={undefined}
                        onResizeCapture={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Grid>
            </Grid>
        </form>
    )
}

export default TextareaBasic
