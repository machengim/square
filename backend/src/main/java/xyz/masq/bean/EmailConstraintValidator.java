package xyz.masq.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import xyz.masq.annotation.ValidEmail;
import xyz.masq.lib.Utils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailConstraintValidator implements ConstraintValidator<ValidEmail, String> {

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.length() == 0) {
            Utils.validationErrorMessage(context, "Empty email not allowed.");
            return false;
        }

        if (!regexMatch(email)) {
            Utils.validationErrorMessage(context, "Email format error: " + email);
            return false;
        }

        if (foundDuplicateEmail(email)) {
            Utils.validationErrorMessage(context, "Duplicate email found: " + email);
            return false;
        }

        return true;
    }

    private boolean regexMatch(String email) {
        final Pattern EMAIL_REGEX =
                Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",
                        Pattern.CASE_INSENSITIVE);
        Matcher matcher = EMAIL_REGEX.matcher(email);

        return matcher.matches();
    }

    private boolean foundDuplicateEmail(String email) {
        JdbcTemplate jdbc = new JdbcTemplate(Utils.getDataSource());
        // queryForList() method can only query for one column, so use uid instead of *.
        String sql = "SELECT uid FROM users WHERE email=?";
        List<Integer> ids = jdbc.queryForList(sql, Integer.class, email);
        System.out.println(ids);
        return ids.size() > 0;
    }

}
