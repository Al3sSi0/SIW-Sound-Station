package it.uniroma3.siw.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Playlist;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.service.BranoService;
import it.uniroma3.siw.service.CredentialsService;
import it.uniroma3.siw.service.PlaylistService;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistRestController {
    @Autowired
    private PlaylistService playlistService;
    @Autowired
    private CredentialsService credentialsService; 
    @Autowired
    private BranoService branoService;
    private User getUtenteCorrente(Principal principal) {
        Credentials credenziali = this.credentialsService.getCredentials(principal.getName());
        return credenziali.getUser();
    }
    
    @GetMapping("/mie")
    public ResponseEntity<List<Playlist>> getMiePlaylists(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User utenteCorrente = getUtenteCorrente(principal);
        List<Playlist> miePlaylists = this.playlistService.findByUtente(utenteCorrente);
        return ResponseEntity.ok(miePlaylists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable Long id) {
        Playlist playlist = this.playlistService.findById(id);
        
        if (playlist == null) {
            return ResponseEntity.notFound().build(); 
        }
        
        return ResponseEntity.ok(playlist);
    }

    
    @PostMapping
    public ResponseEntity<Playlist> creaPlaylist(@Valid @RequestBody Playlist nuovaPlaylist, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User utenteCorrente = getUtenteCorrente(principal);
        
        nuovaPlaylist.setUtente(utenteCorrente);
        nuovaPlaylist.setDataCreazione(LocalDate.now());
        Playlist playlistSalvata = this.playlistService.save(nuovaPlaylist);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(playlistSalvata); 
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Void> modificaPlaylist(@PathVariable Long id, @Valid @RequestBody Playlist datiAggiornati, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Playlist playlistEsistente = this.playlistService.findById(id);
        if (playlistEsistente == null) {
            return ResponseEntity.notFound().build();
        }

        User utenteCorrente = getUtenteCorrente(principal);

        
        if (!playlistEsistente.getUtente().getId().equals(utenteCorrente.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); 
        }

        playlistEsistente.setNome(datiAggiornati.getNome());
        playlistEsistente.setImgUrl(datiAggiornati.getImgUrl());
        playlistEsistente.setBrani(datiAggiornati.getBrani());

        this.playlistService.save(playlistEsistente);
        
        return ResponseEntity.ok().build();
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaPlaylist(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Playlist playlistEsistente = this.playlistService.findById(id);
        if (playlistEsistente == null) {
            return ResponseEntity.notFound().build();
        }

        User utenteCorrente = getUtenteCorrente(principal);

      
        if (!playlistEsistente.getUtente().getId().equals(utenteCorrente.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); 
        }

        this.playlistService.delete(playlistEsistente);
        
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}/brani/{branoId}")
    public ResponseEntity<Void> rimuoviBranoDaPlaylist(@PathVariable Long id, @PathVariable Long branoId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Playlist playlistEsistente = this.playlistService.findById(id);
        if (playlistEsistente == null) {
            return ResponseEntity.notFound().build();
        }

        User utenteCorrente = getUtenteCorrente(principal);

        // Controllo di proprietà: solo chi ha creato la playlist può togliere i brani
        if (!playlistEsistente.getUtente().getId().equals(utenteCorrente.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); 
        }

        // Filtra la lista rimuovendo il brano che corrisponde al branoId passato
        playlistEsistente.getBrani().removeIf(brano -> brano.getId().equals(branoId));

        // Salva lo stato modificato della playlist
        this.playlistService.save(playlistEsistente);

        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/brani/{branoId}")
    public ResponseEntity<Void> aggiungiBranoAPlaylist(@PathVariable Long id, @PathVariable Long branoId, Principal principal) {
        // 1. Verifica token di autenticazione
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2. Controllo esistenza della playlist bersaglio
        Playlist playlistEsistente = this.playlistService.findById(id);
        if (playlistEsistente == null) {
            return ResponseEntity.notFound().build();
        }

        // 3. Controllo permessi: puoi aggiungere canzoni solo alle TUE playlist
        User utenteCorrente = getUtenteCorrente(principal);
        if (!playlistEsistente.getUtente().getId().equals(utenteCorrente.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); 
        }

        // 4. Controllo esistenza del brano da includere
        Brano branoDaInserire = this.branoService.findById(branoId);
        if (branoDaInserire == null) {
            return ResponseEntity.notFound().build();
        }

        // 5. Evitiamo duplicati: se il brano non è già presente, lo inseriamo nella lista
        if (!playlistEsistente.getBrani().contains(branoDaInserire)) {
            playlistEsistente.getBrani().add(branoDaInserire);
            this.playlistService.save(playlistEsistente); // Persistiamo la relazione sul DB
        }

        return ResponseEntity.ok().build();
    }
    
    
}