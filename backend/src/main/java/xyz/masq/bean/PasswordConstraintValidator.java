package xyz.masq.bean;

import org.passay.*;
import xyz.masq.annotation.ValidPassword;
import xyz.masq.lib.Utils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.length() == 0) {
            Utils.validationErrorMessage(context, "Empty password not allowed.");
            return false;
        }

        PasswordValidator validator = new PasswordValidator(Arrays.asList(
                new LengthRule(8, 256),
                new DigitCharacterRule(1)));

        RuleResult result = validator.validate(new PasswordData(password));
        if (result.isValid()) {
            return true;
        }

        Utils.validationErrorMessage(context, "Invalid password: " + password);
        return false;
    }

}