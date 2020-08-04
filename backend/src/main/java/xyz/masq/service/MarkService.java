package xyz.masq.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.masq.entity.Mark;
import xyz.masq.entity.User;
import xyz.masq.error.AuthError;
import xyz.masq.error.GenericError;
import xyz.masq.repository.MarkRepository;
import xyz.masq.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Slf4j
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Transactional
    public void createMark(int uid, int pid) {
        Mark findMark = markRepository.findByUidAndPid(uid, pid);
        if (findMark != null) throw new GenericError("This post has been marked by current user.");

        Mark mark = new Mark();
        mark.setUid(uid);
        mark.setPid(pid);
        markRepository.save(mark);

        User user = userRepository.findByUid(uid);
        user.setMarks(user.getMarks() + 1);
        userRepository.save(user);
    }

    @Transactional
    public void removeMark(int uid, int pid) {
        Mark mark = markRepository.findByUidAndPid(uid, pid);
        if (mark == null) throw new GenericError("Cannot find the required mark.");
        if (mark.getUid() != uid) throw new AuthError("No permission to remove this mark.");
        markRepository.delete(mark);

        User user = userRepository.findByUid(uid);
        int markCount = Math.max(user.getMarks() - 1, 0);
        user.setMarks(markCount);
        userRepository.save(user);
    }

    public boolean checkMarked(int uid, int pid) {
        return markRepository.findByUidAndPid(uid, pid) != null;
    }
}
