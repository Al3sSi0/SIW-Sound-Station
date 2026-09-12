package it.uniroma3.siw.controller;

import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.service.CredentialsService;
import it.uniroma3.siw.service.UserService;
import io.jsonwebtoken.Jwts; // <-- NUOVO IMPORT
import io.jsonwebtoken.SignatureAlgorithm; // <-- NUOVO IMPORT
import io.jsonwebtoken.security.Keys;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationRestController {
	
    @Autowired
    private UserService userService;
    @Autowired
    private CredentialsService credentialsService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private final String SECRET_KEY = "LaTuaChiaveSegretaMoltoLungaEConfidenzialePerILogInMusicSite";
    
    @PostMapping("/register") 
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("nome");
            String surname = request.get("cognome");
            String username = request.get("username");
            String password = request.get("password");
            String email = request.get("email");

            User user = new User();
            user.setName(name);
            user.setSurname(surname);
            user.setEmail(email);
            this.userService.saveUser(user);

            Credentials credentials = new Credentials();
            credentials.setUsername(username);
            credentials.setPassword(password);
            credentials.setUser(user);
            this.credentialsService.saveCredentials(credentials);

            return ResponseEntity.ok(Map.of("message", "Registrazione completata con successo!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username o email già esistenti"));
        }
    }

    @PostMapping("/login") 
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Credentials credentials = this.credentialsService.getCredentials(username);

        if (credentials != null && passwordEncoder.matches(password, credentials.getPassword())) {
            
            // ----------------------------------------------------------------
            // GENERAZIONE DI UN VERO TOKEN JWT CRITTOGRAFATO
            // ----------------------------------------------------------------
            String veroToken = Jwts.builder()
                    .setSubject(username) // Inseriamo lo username nel token
                    .setIssuedAt(new Date(System.currentTimeMillis())) // Data di creazione (ora attuale)
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Scadenza: 24 ore
                    .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256) // Firma crittografica digitale
                    .compact();
            // ----------------------------------------------------------------

            return ResponseEntity.ok(Map.of(
                "token", veroToken, // <-- ORA INVIAMO IL TOKEN VERO!
                "username", username,
                "role", credentials.getRole()
            ));
        }  
     
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenziali errate"));
    }
}