package it.uniroma3.siw.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.service.CredentialsService;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private CredentialsService credentialsService;

    // =========================================================================
    // 👤 ENDPOINT PER RECUPERARE IL PROFILO COMPLETO DELL'UTENTE LOGGATO
    // =========================================================================
    @GetMapping("/me")
    public ResponseEntity<Credentials> getProfiloUtenteCorrente(Principal principal) {
        // 1. Controllo di sicurezza: se il principal è null, il token non è valido o manca
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2. Recuperiamo l'oggetto Credentials (che contiene username, ruolo e l'oggetto User dentro)
        Credentials credenziali = this.credentialsService.getCredentials(principal.getName());
        
        // 3. Se per qualche motivo le credenziali non esistono nel DB, restituiamo 404
        if (credenziali == null) {
            return ResponseEntity.notFound().build();
        }

        // 4. Risposta positiva: restituiamo le credenziali complete in formato JSON
        return ResponseEntity.ok(credenziali);
    }
}