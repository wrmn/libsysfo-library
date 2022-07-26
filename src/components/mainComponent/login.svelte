<script>
  import {
    LoginScreen,
    View,
    Page,
    f7,
    List,
    LoginScreenTitle,
    ListInput,
    BlockFooter,
    ListButton,
  } from "framework7-svelte";
  import { postWithoutAuth } from "../../js/api";
  import { getData } from "../../js/api/profile";
  import { notLogin } from "../../js/store";

  let indicator, password;

  const postLogin = async () => {
    const msg = await postWithoutAuth(
      { indicator, password },
      `/admin/library/login`
    );
    if (msg.status != 200) {
      f7.dialog.close();
      f7.dialog.alert(msg.description, "Login Failed");
    } else {
      f7.dialog.close();
      localStorage.setItem("account-credential", msg.data.token);
      notLogin.set(false);
      f7.loginScreen.close();
      getData();
    }
  };
</script>

<LoginScreen id="my-login-screen" bind:opened={$notLogin}>
  <View>
    <Page loginScreen>
      <LoginScreenTitle>Login</LoginScreenTitle>
      <List noHairlinesMd>
        <ListInput
          type="text"
          label="Email or Username"
          placeholder="Your email or username"
          floatingLabel
          bind:value={indicator}
        />
        <ListInput
          type="password"
          label="Password"
          placeholder="Your password"
          floatingLabel
          bind:value={password}
        />
      </List>
      <List>
        <ListButton title="Sign In" onClick={() => postLogin()} />
      </List>
    </Page>
  </View>
</LoginScreen>
