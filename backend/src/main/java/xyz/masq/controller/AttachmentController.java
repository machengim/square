package xyz.masq.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import xyz.masq.error.GenericError;
import xyz.masq.service.AttachmentService;

import java.io.*;

@RestController
@RequestMapping(value = "attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping(path = "/{year}/{month}/{file:.+}",
            produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE})
    @ResponseBody
    public byte[] getImage(@PathVariable int year, @PathVariable int month, @PathVariable String file,
                           @RequestParam String expire, @RequestParam String sign)
            throws IOException{

        if (expire == null || sign == null) {
            throw new GenericError("Invalid request for attachment: " + file);
        }
        if (!attachmentService.checkSignedUrl(file, expire, sign)) {
            throw new GenericError("Malformed signed URL for attachment: " + file);
        }

        String sep = File.separator;
        String path = "attachments" + sep + year + sep + month + sep + file;
        InputStream in = new FileInputStream(path);

        return IOUtils.toByteArray(in);
    }
}
