package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Integer id;
    private String userAccountId;
    private String nickname;
    private String firstname;
    private String surname;
    private String email;
    private String avatar;
    private Boolean isReviewer;
}
