package xyz.masq.entity;

import lombok.Data;
import xyz.masq.annotation.ValidPassword;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@Table(name = "USERS")  // 'user' is a reserved keyword in postgres.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;
    private String uname = "Anonymous";
    @Email
    @NotNull
    private String email;
    @ValidPassword
    private String password;
    // type == 0 means inactive, 1 means registered, 2 means validated-email, 3 means trusted, 99 means admin, -1 means blocked;
    // Currently registered users are allowed to send pictures.
    private int type = 0;
    private int posts = 0;
    private int marks = 0;
    private int messages = 0;
    private Instant ctime = Instant.now();

}
