// ** Type Import

const Progress = () => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: () => ({
          height: 12,
          borderRadius: '10px',
          backgroundColor: '#F1F0F2'
        }),
        bar: {
          borderRadius: '10px'
        }
      }
    }
  }
}

export default Progress
