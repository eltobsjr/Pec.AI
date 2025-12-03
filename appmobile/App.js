import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEBSITE_URL = 'https://pec-ai.vercel.app';

export default function App() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="auto" />
      
      <WebView
        source={{ uri: WEBSITE_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        bounces={true}
        scrollEnabled={true}
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        javaScriptCanOpenWindowsAutomatically={true}
        mixedContentMode="always"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        geolocationEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
