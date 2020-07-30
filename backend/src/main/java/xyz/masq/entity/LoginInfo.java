package xyz.masq.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
@Table(name = "login")
public class LoginInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lid;
    private int uid;
    private String ip;
    private String device;
    private Instant ctime = Instant.now();
}
