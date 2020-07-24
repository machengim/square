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
    // type == 0 means inactive, 1 means normal, 2 means admin, -1 means blocked;
    private int type = 0;
    private int posts = 0;
    private int marks = 0;
    private int messages = 0;
    private Instant ctime = Instant.now();

}
