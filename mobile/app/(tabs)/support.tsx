import { View, Text, TextInput, Button } from 'react-native';

export default function SupportScreen() {
  // You could build a contact form here that calls a Supabase Edge Function
  // to send an email or log the support ticket.
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Contact Us</Text>
      <Text style={{ marginBottom: 16 }}>Have questions? Reach out to our team.</Text>
      <TextInput placeholder="Your Email" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <TextInput placeholder="Your Message" multiline style={{ borderWidth: 1, padding: 8, height: 100, marginBottom: 12 }} />
      <Button title="Submit" onPress={() => alert('Message sent (feature coming soon)!')} />
    </View>
  );
}