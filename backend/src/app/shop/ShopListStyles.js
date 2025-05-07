export const shopListStyles = {
    container: {
      padding: '30px',
      width: '100%',
    },
    heading: {
      color: '#333',
      marginBottom: '30px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '20px',
      gap: '20px',
      alignItems: 'center',
    },
    input: {
      padding: '10px 15px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '14px',
      minWidth: '250px',
      outline: 'none',
      transition: 'border 0.3s',
      '&:focus': {
        borderColor: '#4CAF50',
      },
    },
    button: (color) => ({
      padding: '10px 20px',
      backgroundColor: color,
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'opacity 0.3s, transform 0.2s',
      '&:hover': {
        opacity: 0.9,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
      padding: '10px 0',
    },
    card: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      },
    },
    cardText: {
      margin: '0',
      fontSize: '15px',
      color: '#333',
      lineHeight: '1.5',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '15px',
    },
    noResults: {
      textAlign: 'center',
      color: '#666',
      fontSize: '16px',
      gridColumn: '1 / -1',
      padding: '40px 0',
    },
    editInput: {
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '14px',
      width: '100%',
      outline: 'none',
      transition: 'border 0.3s',
      '&:focus': {
        borderColor: '#4CAF50',
      },
    },
    // Modal Styles
    modalOverlay: { 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 1000 
    },
    modalContent: { 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '10px', 
      width: '400px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      padding: '5px 10px'
    },
    iconContainer: {
      marginRight: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    modalInput: {
      flex: 1,
      padding: '10px',
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
      fontSize: '14px'
    },
    modalButtonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      gap: '15px'
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#e0e0e0',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    confirmButton: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#4CAF50',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'white'
    },
    modalHeading: {
      marginBottom: '20px', 
      textAlign: 'center',
      color: '#333',
      fontSize: '20px',
      fontWeight: 'bold'
    }
  };