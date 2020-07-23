package xyz.masq.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
@Table(name = "USERS")  // 'user' is a reserved keyword in postgres.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;
    private String uname = "Anonymous";
    private String email;
    private String password;
    private int type = 0;
    private int posts = 0;
    private int marks = 0;
    private int messages = 0;
    private Instant ctime = Instant.now();

}
