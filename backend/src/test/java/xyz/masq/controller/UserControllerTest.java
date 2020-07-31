package xyz.masq.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import xyz.masq.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void getAllUsersTest() throws Exception {
        this.mockMvc.perform(get("/user"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void registerTest() throws Exception {
        String url = "/user/register";
        String json = "{\"email\": \"ab@cd.com\", \"password\": \"qwer1234\"}";
        this.mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Saved"));
    }

    //Invalid password format, should get rejected with http status 400.
    @Test
    public void registerInvalidPasswordTest() throws Exception {
        String url = "/user/register";
        String json = "{\"email\": \"a@b.c\", \"password\": \"1234\"}";
        this.mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json))
                .andDo(print())
                .andExpect(status().is4xxClientError());
    }

    //Invalid email format, should get rejected with http status 400.
    @Test
    public void registerInvalidEmailTest() throws Exception {
        String url = "/user/register";
        String json = "{\"email\": \"abc\", \"password\": \"qwer1234\"}";
        this.mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json))
                .andDo(print())
                .andExpect(status().is4xxClientError());
    }
}
