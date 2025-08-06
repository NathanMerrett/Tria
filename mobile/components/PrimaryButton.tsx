import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

// We extend the default ButtonProps and add our own 'loading' prop
interface PrimaryButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, loading, ...props }) => {
  return (
    <Button
      {...props}
      mode="contained"
      loading={loading}
      style={[styles.button, props.style]}
      labelStyle={styles.buttonLabel}
      disabled={loading || props.disabled}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrimaryButton;