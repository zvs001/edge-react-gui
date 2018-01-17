# by some reason this always throw error: starting process node error
./android/gradlew --stop

export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_NDK_HOME=$HOME/Android/Sdk/ndk-bundle
npm run android:release
