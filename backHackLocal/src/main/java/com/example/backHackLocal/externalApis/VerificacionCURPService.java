package com.example.backHackLocal.externalApis;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class VerificacionCURPService {

    private static final String VERIFICAMEX_API = "https://api.verificamex.com/v1/scraping/renapo";

    // ⚠️ En producción, mueve esto a application.properties y lee con @Value
    private static final String API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDllMGRlODU0NjI1NThjMWUzOGFkZjU4ZjZkOTE5MzBhNWU5MmZiZGNmMGYxODUzY2NhN2U5N2RjOGMwNzQxNmFiNzM2NmQ1MmJkNjIyZWYiLCJpYXQiOjE3NDg0OTk0NTQuNzQ1NjAzLCJuYmYiOjE3NDg0OTk0NTQuNzQ1NjIyLCJleHAiOjE3ODAwMzU0NTQuNzI2OCwic3ViIjoiNjE1MiIsInNjb3BlcyI6W119.blZydhhwzIR1651zOw92JQ9CO97IdsX8w_IDdb5dC5ylgNVmtUpxc8qtZjvbbPsODmZaEWnW-9c20ykf8Enpecn8RvkYD8AX4oVDk5cgtOKlzcclkiVavsmCb-niJQlMDIkl89EfDdSzj7FYcy5OejOfaBOeyd0jJ6cnoIhYyx81hZoW_i9KM1iT8MV_ohsim8UpqOBXumpbhOod5Uv0-iKD39KAzsEqMN14TJA9hjVscvcQFJTx2ycCOFrrdK6oCYJypt5Hj6CGMx88NZOsz6MwRUwtqDWjQe1To5XHepq85fOz4rPVrKDD6I2n-EJIt_cmz9AKn7E1GzaqxHahVX1yVKoCOrvteG8ycL5ACmHcva_BHwRMhuJFIoSe2KQmU3uuIabEB5NoC4g6JmJxqVGuaLvaDxFSlDoDwyR-UoV7GCAUaskPeYzy5uc0Ab3GefeU9bYdxpAke50dZt8SW9khIjaEWj67cEW_w312tdRNfoxBHrrmwB-wGfkIvHCd6tmGDR8uoB8YTnj6o0AqIih4uNswfbWmIZtT1sR0stYCbEuSswtiirAOYszQTwIKMMs_0tbIsTF0EEHv1WDIC_jRsEg6ys7OkY6G2ZrL_TVHrfXaiLMHuo-BkhuH01WqXGXWCZWQ3qJwTGsBZVpk3rB5Oz0xPINMpvs4Zth6N6Q";

    public ResponseEntity<?> verificarCURP(String curp) {
        RestTemplate restTemplate = new RestTemplate();

        // Headers con Bearer token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        // JSON body con la CURP
        Map<String, String> body = new HashMap<>();
        body.put("curp", curp);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    VERIFICAMEX_API,
                    entity,
                    Map.class
            );
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "Error en la verificación de CURP",
                            "detalle", e.getMessage()
                    ));
        }
    }
}
