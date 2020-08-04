package xyz.masq.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.Instant;

@Entity
@Data
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mid;
    private int uid;
    private int pid;
    private Instant ctime = Instant.now();
}
